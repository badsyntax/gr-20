import React, { Fragment, memo, useEffect } from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import VectorLayer from 'ol/layer/Vector';
import { TabPanel } from '../TabPanel/TabPanel';
import { NextPointData } from '../NextPointData/NextPointData';

export interface WaypointDetailTabsProps {
  feature: Feature<Point>;
  nextFeature?: Feature<Point>;
  prevFeature?: Feature<Point>;
  gpxVectorLayer: VectorLayer;
}

export const WaypointDetailTabs: React.FunctionComponent<WaypointDetailTabsProps> = memo(
  ({ feature, nextFeature, prevFeature, gpxVectorLayer }) => {
    const [value, setValue] = React.useState<number>(
      nextFeature ? 0 : prevFeature ? 1 : -1
    );
    const handleChange = (
      event: React.ChangeEvent<Record<string, unknown>>,
      newValue: number
    ) => {
      setValue(newValue);
    };
    useEffect(() => {
      setValue(nextFeature ? 0 : prevFeature ? 1 : -1);
    }, [nextFeature, prevFeature]);
    return (
      <Fragment>
        <Tabs
          value={value}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          onChange={handleChange}
        >
          <Tab label="Next Point" disabled={!nextFeature} />
          <Tab label="Prev Point" disabled={!prevFeature} />
        </Tabs>
        <TabPanel value={value} index={0}>
          {nextFeature && (
            <NextPointData
              gpxVectorLayer={gpxVectorLayer}
              feature={feature}
              nextFeature={nextFeature}
              name={nextFeature.getProperties().name}
            />
          )}
        </TabPanel>
        <TabPanel value={value} index={1}>
          {prevFeature && (
            <NextPointData
              gpxVectorLayer={gpxVectorLayer}
              feature={prevFeature}
              nextFeature={feature}
              name={prevFeature.getProperties().name}
            />
          )}
        </TabPanel>
      </Fragment>
    );
  }
);
