/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { getLegendConfigSelector } from './get_legend_config_selector';
import { LegendSizing } from './get_legend_size';
import { DEFAULT_FONT_FAMILY } from '../../common/default_theme_attributes';
import { LegendItem, legendValueTitlesMap } from '../../common/legend';
import { Font } from '../../common/text_utils';
import {
  GRID_ACTION_WIDTH,
  GRID_COLOR_WIDTH,
  MIN_LABEL_WIDTH,
} from '../../components/legend/legend_table/legend_table';
import { withTextMeasure } from '../../utils/bbox/canvas_text_bbox_calculator';
import { isDefined, LayoutDirection } from '../../utils/common';
import { Dimensions } from '../../utils/dimensions';
import { Theme } from '../../utils/themes/theme';

const MONO_LETTER_WIDTH = 7.77;
const MONO_SEPARATOR_WIDTH = 4.5;

const SCROLL_BAR_WIDTH = 16; // ~1em
const VERTICAL_PADDING = 4;
const TOP_MARGIN = 2;

const GRID_CELL_PADDING = { height: 4, width: 8 };
const GRID_MARGIN = 8;
const HORIZONTAL_VISIBLE_LINES_NUMBER = 3;
const GRID_CELL_BORDER_WIDTH = 1;

const fontArgs: [Font, number, number] = [
  {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontWeight: 400,
    fontVariant: 'normal',
    fontStyle: 'normal',
    textColor: 'black',
  },
  12,
  1.34,
];

const headerFontArgs: [Font, number, number] = [
  {
    ...fontArgs[0],
    fontWeight: 500,
  },
  fontArgs[1],
  fontArgs[2],
];

/** @internal */
export function getLegendTableSize(
  config: ReturnType<typeof getLegendConfigSelector>,
  theme: Theme,
  parentDimensions: Dimensions,
  items: LegendItem[],
): LegendSizing {
  const { legendSize, legendValues, legendPosition, legendAction } = config;

  const { height, ...headerBbox } = withTextMeasure((textMeasure) => {
    const { width, height: h } = textMeasure(config.legendTitle || '', ...headerFontArgs);
    const valuesWidths = legendValues.map((v) => textMeasure(legendValueTitlesMap[v], ...fontArgs).width);
    return { labelWidth: width, valuesWidths, height: h };
  });

  const widestLabelWidth = withTextMeasure((textMeasure) =>
    items.reduce(
      (acc, { label }) => Math.max(acc, textMeasure(label, ...fontArgs).width),
      Math.max(headerBbox.labelWidth, MIN_LABEL_WIDTH),
    ),
  );

  const widestValuesWidths = items.reduce((acc, { values }) => {
    const valuesWidths = values.map((v) =>
      v.label.includes('.')
        ? (v.label.length - 1) * MONO_LETTER_WIDTH + MONO_SEPARATOR_WIDTH
        : v.label.length * MONO_LETTER_WIDTH,
    );
    return acc.map((w, i) => Math.max(w, valuesWidths[i] || 0));
  }, headerBbox.valuesWidths);

  const legendItemWidth =
    widestLabelWidth +
    GRID_CELL_PADDING.width * 2 +
    widestValuesWidths.reduce((acc, w) => acc + w + GRID_CELL_PADDING.width * 2, 0);

  const {
    legend: { verticalWidth, spacingBuffer, margin },
  } = theme;

  const actionWidth = isDefined(legendAction) ? GRID_ACTION_WIDTH : 0;

  if (legendPosition.direction === LayoutDirection.Vertical) {
    const legendItemHeight = height + VERTICAL_PADDING * 2;
    const legendHeight = legendItemHeight * items.length + TOP_MARGIN;
    const scrollBarDimension = legendHeight > parentDimensions.height ? SCROLL_BAR_WIDTH : 0;
    const staticWidth = GRID_COLOR_WIDTH + GRID_MARGIN * 2 + actionWidth + scrollBarDimension;

    const maxAvailableWidth = parentDimensions.width * 0.5;

    const width = Number.isFinite(legendSize)
      ? Math.min(Math.max(legendSize, legendItemWidth * 0.3 + staticWidth), maxAvailableWidth)
      : Math.floor(Math.min(legendItemWidth + staticWidth, maxAvailableWidth));

    return {
      height: legendHeight,
      width,
      margin,
      position: legendPosition,
      seriesWidth: Math.floor(Math.min(widestLabelWidth + GRID_CELL_PADDING.width * 2, maxAvailableWidth / 2)),
    };
  }

  const visibleLinesNumber = Math.min(items.length + 1, HORIZONTAL_VISIBLE_LINES_NUMBER);
  const singleLineHeight = height + GRID_CELL_PADDING.height * 2 + GRID_CELL_BORDER_WIDTH;
  return {
    height: singleLineHeight * visibleLinesNumber + GRID_MARGIN,
    width: Math.floor(Math.min(legendItemWidth + spacingBuffer + actionWidth, verticalWidth)),
    margin,
    position: legendPosition,
  };
}
