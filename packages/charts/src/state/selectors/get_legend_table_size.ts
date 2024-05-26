/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { getLegendConfigSelector } from './get_legend_config_selector';
import { LegendSizing } from './get_legend_size';
import { legendValueTitlesMap } from '../../chart_types/xy_chart/state/utils/get_legend_values';
import { DEFAULT_FONT_FAMILY } from '../../common/default_theme_attributes';
import { LegendItem } from '../../common/legend';
import { Font } from '../../common/text_utils';
import { withTextMeasure } from '../../utils/bbox/canvas_text_bbox_calculator';
import { isDefined, LayoutDirection } from '../../utils/common';
import { Dimensions } from '../../utils/dimensions';
import { Theme } from '../../utils/themes/theme';

const SCROLL_BAR_WIDTH = 16; // ~1em
const VERTICAL_PADDING = 4;
const TOP_MARGIN = 2;

const GRID_CELL_PADDING = { height: 4, width: 8 };
const GRID_MARGIN = 8;
const HORIZONTAL_GRID_LINE_NUMBER = 3;
const GRID_COLOR_PICKER_WIDTH = 10;
const GRID_ACTION_WIDTH = 26;
const MONO_LETTER_WIDTH = 7.77;
const DOT_WIDTH = 4.5;

const fontStyle: Font = {
  textColor: 'black',
  fontFamily: DEFAULT_FONT_FAMILY,
  fontVariant: 'normal',
  fontWeight: 400,
  fontStyle: 'normal',
};

const headerFontStyle: Font = {
  ...fontStyle,
  fontWeight: 500,
};

/** @internal */
export function getLegendTableSize(
  config: ReturnType<typeof getLegendConfigSelector>,
  theme: Theme,
  parentDimensions: Dimensions,
  items: LegendItem[],
): LegendSizing {
  const { legendSize, legendValues, legendPosition, legendAction } = config;

  const colorPickerWidth = GRID_COLOR_PICKER_WIDTH;

  const actionWidth = isDefined(legendAction) ? GRID_ACTION_WIDTH : 0;

  const headerBbox = withTextMeasure((textMeasure) => {
    const { width: labelWidth, height } = textMeasure(config.legendTitle || '', headerFontStyle, 12, 1.34);
    const valuesWidths = legendValues.map((v) => textMeasure(legendValueTitlesMap[v], fontStyle, 12, 1.34).width);
    return { labelWidth, valuesWidths, height };
  });

  const widestLabelWidth = withTextMeasure((textMeasure) =>
    items.reduce((acc, { label }) => {
      const { width } = textMeasure(label, fontStyle, 12, 1.34);
      return Math.max(acc, width);
    }, headerBbox.labelWidth),
  );

  const widestValuesWidths = items.reduce((acc, { values }) => {
    const valuesWidths = values.map((v) =>
      v.label.includes('.') ? (v.label.length - 1) * MONO_LETTER_WIDTH + DOT_WIDTH : v.label.length * MONO_LETTER_WIDTH,
    );
    return acc.map((w, i) => Math.max(w, valuesWidths[i] || 0));
  }, headerBbox.valuesWidths);

  const legendItemWidth =
    Math.max(widestLabelWidth, 40) +
    GRID_CELL_PADDING.width * 2 +
    widestValuesWidths.reduce((acc, w) => acc + w + GRID_CELL_PADDING.width * 2, 0);

  const {
    legend: { verticalWidth, spacingBuffer, margin },
  } = theme;

  if (legendPosition.direction === LayoutDirection.Vertical) {
    const legendItemHeight = headerBbox.height + VERTICAL_PADDING * 2;
    const legendHeight = legendItemHeight * items.length + TOP_MARGIN;
    const scrollBarDimension = legendHeight > parentDimensions.height ? SCROLL_BAR_WIDTH : 0;
    const staticWidth = colorPickerWidth + GRID_MARGIN * 2 + actionWidth + scrollBarDimension;

    const maxAvailableWidth = parentDimensions.width * 0.5;

    const width = Number.isFinite(legendSize)
      ? Math.min(Math.max(legendSize, legendItemWidth * 0.3 + staticWidth), maxAvailableWidth)
      : Math.floor(Math.min(legendItemWidth + staticWidth, maxAvailableWidth));

    return {
      width,
      height: legendHeight,
      margin,
      position: legendPosition,
    };
  }
  const visibleLinesNumber = Math.min(items.length + 1, HORIZONTAL_GRID_LINE_NUMBER);
  const singleLineHeight = headerBbox.height + GRID_CELL_PADDING.height * 2 + 1;
  const height = Number.isFinite(legendSize)
    ? Math.min(legendSize, parentDimensions.height * 0.7)
    : singleLineHeight * visibleLinesNumber + GRID_MARGIN;

  return {
    height,
    width: Math.floor(Math.min(legendItemWidth + spacingBuffer + actionWidth, verticalWidth)),
    margin,
    position: legendPosition,
  };
}
