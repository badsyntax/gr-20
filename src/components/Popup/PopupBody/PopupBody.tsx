import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import VectorLayer from 'ol/layer/Vector';
import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';

import {
  PopoverBody,
  Nav,
  NavItem,
  TabContent,
  TabPane,
  NavLink,
} from 'reactstrap';
import { NextPointData } from '../NextPointData/NextPointData';
import { PointData } from '../PointData/PointData';
import STYLES from './PopupBody.module.scss';

const c = classNames.bind(STYLES);

export interface PopupBodyProps {
  gpxVectorLayer: VectorLayer;
  feature: Feature<Point>;
  nextFeature?: Feature<Point>;
  prevFeature?: Feature<Point>;
  elevation: number;
  lon: string;
  lat: string;
  hdms: string;
  scheduleUpdate: () => void;
}

export const PopupBody: React.FunctionComponent<PopupBodyProps> = ({
  gpxVectorLayer,
  feature,
  nextFeature,
  prevFeature,
  elevation,
  lon,
  lat,
  hdms,
  scheduleUpdate,
}) => {
  const [activeTab, setActiveTab] = useState('1');

  const toggle = (tab: string) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
      scheduleUpdate();
    }
  };

  useEffect(() => {
    setActiveTab('1');
  }, [feature]);
  return (
    <PopoverBody>
      <Nav tabs>
        <NavItem>
          <NavLink
            className={c({ active: activeTab === '1' })}
            href="#info"
            onClick={(e) => {
              e.preventDefault();
              toggle('1');
            }}
          >
            Info
          </NavLink>
        </NavItem>

        {nextFeature && (
          <NavItem>
            <NavLink
              className={c({ active: activeTab === '2' })}
              href="next"
              onClick={(e) => {
                e.preventDefault();
                toggle('2');
              }}
            >
              Next Point
            </NavLink>
          </NavItem>
        )}
        {prevFeature && (
          <NavItem>
            <NavLink
              className={c({ active: activeTab === '3' })}
              href="#prev"
              onClick={(e) => {
                e.preventDefault();
                toggle('3');
              }}
            >
              Previous Point
            </NavLink>
          </NavItem>
        )}
      </Nav>
      <TabContent activeTab={activeTab}>
        <TabPane tabId="1" className={c('tab-pane')}>
          <PointData elevation={elevation} lon={lon} lat={lat} hdms={hdms} />
        </TabPane>
        {nextFeature && (
          <TabPane tabId="2" className={c('tab-pane')}>
            <NextPointData
              gpxVectorLayer={gpxVectorLayer}
              feature={feature}
              nextFeature={nextFeature}
            />
          </TabPane>
        )}
        {prevFeature && (
          <TabPane tabId="3" className={c('tab-pane')}>
            <NextPointData
              gpxVectorLayer={gpxVectorLayer}
              feature={prevFeature}
              nextFeature={feature}
            />
          </TabPane>
        )}
      </TabContent>
    </PopoverBody>
  );
};
