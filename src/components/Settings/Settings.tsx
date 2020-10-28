import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateSettings } from '../../features/settings';
import { RootState } from '../../store';
import { DropdownGroup } from '../DropdownGroup/DropdownGroup';
import { options } from './settingsOptions';

export const Settings: React.FunctionComponent = () => {
  const settings = useSelector((state: RootState) => state.settings);
  const dispatch = useDispatch();

  const onSettingsChange = (name: string, value: string | boolean) => {
    dispatch(
      updateSettings({
        [name]: value,
      })
    );
  };

  return (
    <DropdownGroup
      options={options}
      values={settings}
      onChange={onSettingsChange}
    />
  );
};
