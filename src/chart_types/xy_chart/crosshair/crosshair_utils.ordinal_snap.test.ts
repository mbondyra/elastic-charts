import { computeXScale } from '../utils/scales';
import { BasicSeriesSpec } from '../utils/specs';
import { getGroupId, getSpecId } from '../../../utils/ids';
import { ScaleType } from '../../../utils/scales/scales';
import { getSnapPosition } from './crosshair_utils';
import { computeSeriesDomains } from '../store/utils';

describe('Crosshair utils ordinal scales', () => {
  const barSeries1SpecId = getSpecId('barSeries1');
  const barSeries2SpecId = getSpecId('barSeries2');
  const lineSeries1SpecId = getSpecId('lineSeries1');
  const lineSeries2SpecId = getSpecId('lineSeries2');

  const barSeries1: BasicSeriesSpec = {
    id: barSeries1SpecId,
    groupId: getGroupId('group1'),
    seriesType: 'bar',
    data: [['a', 0], ['b', 0], ['c', 0]],
    xAccessor: 0,
    yAccessors: [1],
    xScaleType: ScaleType.Ordinal,
    yScaleType: ScaleType.Linear,
    yScaleToDataExtent: true,
  };
  const barSeries2: BasicSeriesSpec = {
    id: barSeries2SpecId,
    groupId: getGroupId('group1'),
    seriesType: 'bar',
    data: [['a', 2], ['b', 2], ['c', 2]],
    xAccessor: 0,
    yAccessors: [1],
    xScaleType: ScaleType.Ordinal,
    yScaleType: ScaleType.Linear,
    yScaleToDataExtent: true,
  };
  const lineSeries1: BasicSeriesSpec = {
    id: lineSeries1SpecId,
    groupId: getGroupId('group1'),
    seriesType: 'line',
    data: [['a', 0], ['b', 0], ['c', 0]],
    xAccessor: 0,
    yAccessors: [1],
    xScaleType: ScaleType.Ordinal,
    yScaleType: ScaleType.Linear,
    yScaleToDataExtent: true,
  };
  const lineSeries2: BasicSeriesSpec = {
    id: lineSeries2SpecId,
    groupId: getGroupId('group1'),
    seriesType: 'line',
    data: [['a', 2], ['b', 2], ['c', 2]],
    xAccessor: 0,
    yAccessors: [1],
    xScaleType: ScaleType.Ordinal,
    yScaleType: ScaleType.Linear,
    yScaleToDataExtent: true,
  };

  const barSeriesMap = new Map();
  barSeriesMap.set(barSeries1SpecId, barSeries1);
  const barSeriesDomains = computeSeriesDomains(barSeriesMap, new Map(), undefined);

  const multiBarSeriesMap = new Map();
  multiBarSeriesMap.set(barSeries1SpecId, barSeries1);
  multiBarSeriesMap.set(barSeries2SpecId, barSeries2);
  const multiBarSeriesDomains = computeSeriesDomains(multiBarSeriesMap, new Map(), undefined);

  const lineSeriesMap = new Map();
  lineSeriesMap.set(lineSeries1SpecId, lineSeries1);
  const lineSeriesDomains = computeSeriesDomains(lineSeriesMap, new Map(), undefined);

  const multiLineSeriesMap = new Map();
  multiLineSeriesMap.set(lineSeries1SpecId, lineSeries1);
  multiLineSeriesMap.set(lineSeries2SpecId, lineSeries2);
  const multiLineSeriesDomains = computeSeriesDomains(multiLineSeriesMap, new Map(), undefined);

  const mixedLinesBarsMap = new Map();
  mixedLinesBarsMap.set(lineSeries1SpecId, lineSeries1);
  mixedLinesBarsMap.set(lineSeries2SpecId, lineSeries2);
  mixedLinesBarsMap.set(barSeries1SpecId, barSeries1);
  mixedLinesBarsMap.set(barSeries2SpecId, barSeries2);
  const mixedLinesBarsSeriesDomains = computeSeriesDomains(mixedLinesBarsMap, new Map(), undefined);

  const barSeriesScale = computeXScale({
    xDomain: barSeriesDomains.xDomain,
    totalBarsInCluster: barSeriesMap.size,
    range: [0, 120],
  });
  const multiBarSeriesScale = computeXScale({
    xDomain: multiBarSeriesDomains.xDomain,
    totalBarsInCluster: multiBarSeriesMap.size,
    range: [0, 120],
  });
  const lineSeriesScale = computeXScale({
    xDomain: lineSeriesDomains.xDomain,
    totalBarsInCluster: lineSeriesMap.size,
    range: [0, 120],
  });
  const multiLineSeriesScale = computeXScale({
    xDomain: multiLineSeriesDomains.xDomain,
    totalBarsInCluster: multiLineSeriesMap.size,
    range: [0, 120],
  });
  const mixedLinesBarsSeriesScale = computeXScale({
    xDomain: mixedLinesBarsSeriesDomains.xDomain,
    totalBarsInCluster: mixedLinesBarsMap.size,
    range: [0, 120],
  });

  test('can snap position on scale ordinal bar', () => {
    let snappedPosition = getSnapPosition('a', barSeriesScale);
    expect(snappedPosition!.band).toEqual(40);
    expect(snappedPosition!.position).toEqual(0);

    snappedPosition = getSnapPosition('b', barSeriesScale);
    expect(snappedPosition!.band).toEqual(40);
    expect(snappedPosition!.position).toEqual(40);

    snappedPosition = getSnapPosition('c', barSeriesScale);
    expect(snappedPosition!.band).toEqual(40);
    expect(snappedPosition!.position).toEqual(80);

    snappedPosition = getSnapPosition('x', barSeriesScale);
    expect(snappedPosition).toBeUndefined();

    snappedPosition = getSnapPosition('a', multiBarSeriesScale, 2);
    expect(snappedPosition!.band).toEqual(40);
    expect(snappedPosition!.position).toEqual(0);

    snappedPosition = getSnapPosition('b', multiBarSeriesScale, 2);
    expect(snappedPosition!.band).toEqual(40);
    expect(snappedPosition!.position).toEqual(40);

    snappedPosition = getSnapPosition('c', multiBarSeriesScale, 2);
    expect(snappedPosition!.band).toEqual(40);
    expect(snappedPosition!.position).toEqual(80);
  });
  test('can snap position on scale ordinal lines', () => {
    let snappedPosition = getSnapPosition('a', lineSeriesScale);
    expect(snappedPosition!.band).toEqual(40);
    expect(snappedPosition!.position).toEqual(0);

    snappedPosition = getSnapPosition('b', lineSeriesScale);
    expect(snappedPosition!.band).toEqual(40);
    expect(snappedPosition!.position).toEqual(40);

    snappedPosition = getSnapPosition('c', lineSeriesScale);
    expect(snappedPosition!.band).toEqual(40);
    expect(snappedPosition!.position).toEqual(80);

    snappedPosition = getSnapPosition('x', lineSeriesScale);
    expect(snappedPosition).toBeUndefined();

    snappedPosition = getSnapPosition('a', multiLineSeriesScale, 2);
    expect(snappedPosition!.band).toEqual(40);
    expect(snappedPosition!.position).toEqual(0);

    snappedPosition = getSnapPosition('b', multiLineSeriesScale, 2);
    expect(snappedPosition!.band).toEqual(40);
    expect(snappedPosition!.position).toEqual(40);

    snappedPosition = getSnapPosition('c', multiLineSeriesScale, 2);
    expect(snappedPosition!.band).toEqual(40);
    expect(snappedPosition!.position).toEqual(80);
  });

  test('can snap position on scale ordinal mixed lines/bars', () => {
    let snappedPosition = getSnapPosition('a', mixedLinesBarsSeriesScale, 4);
    expect(snappedPosition!.band).toEqual(40);
    expect(snappedPosition!.position).toEqual(0);

    snappedPosition = getSnapPosition('b', mixedLinesBarsSeriesScale, 4);
    expect(snappedPosition!.band).toEqual(40);
    expect(snappedPosition!.position).toEqual(40);

    snappedPosition = getSnapPosition('c', mixedLinesBarsSeriesScale, 4);
    expect(snappedPosition!.band).toEqual(40);
    expect(snappedPosition!.position).toEqual(80);

    snappedPosition = getSnapPosition('x', mixedLinesBarsSeriesScale, 4);
    expect(snappedPosition).toBeUndefined();
  });
});
