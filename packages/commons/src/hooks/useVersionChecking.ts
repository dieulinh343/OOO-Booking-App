import { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

const SUCCESS_STATUS = 200;

interface VersionCheckingConfig {
  versionCheckingEnabled: boolean;
  versionCheckingInterval?: number;
  buildTimestamp?: string;
  publicPath?: string;
}

const useVersionChecking = ({ handleNewVersionAvailable, config } : {
  handleNewVersionAvailable: () => void,
  config: VersionCheckingConfig
}) => {
  const {
    versionCheckingEnabled,
    versionCheckingInterval,
    buildTimestamp: currentBuildTimeStamp,
    publicPath,
  } = config;

  const checkVersion = useCallback(async () => {
    if (!currentBuildTimeStamp) {
      return false;
    }

    const response = await fetch(`${publicPath}/version.json?current_version=${currentBuildTimeStamp}`, {
      credentials: 'same-origin',
    });
    if (response && response.status === SUCCESS_STATUS) {
      const data = await response.json();

      if (parseInt(currentBuildTimeStamp) !== parseInt(data.buildTimeStamp)) {
        return true;
      }
    }
    return false;
  }, [currentBuildTimeStamp, publicPath]);

  useEffect(() => {
    let interval: number;

    if (versionCheckingEnabled) {
      interval = window.setInterval(async () => {
        const showed = await checkVersion();
        if (showed) {
          handleNewVersionAvailable();
        }
      }, versionCheckingInterval);
    }

    return () => {
      versionCheckingEnabled && clearInterval(interval);
    };
  }, [checkVersion, handleNewVersionAvailable, versionCheckingEnabled, versionCheckingInterval]);
};

export default useVersionChecking;
