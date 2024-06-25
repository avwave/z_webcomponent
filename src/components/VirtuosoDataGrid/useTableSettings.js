import { useState, useEffect } from 'react';

const useTableSettings = (key, initialValue, enableStorage = true) => {
  if (!key || typeof key !== 'string') {
    throw new Error('Datagrid V3 useTableSettings: key must be a non-empty string');
  }

  const [variant, setVariant] = useState('default');
  const [settings, setSettings] = useState(() => {
    if (enableStorage) {
      const storedValue = localStorage.getItem(`${key}_${variant}`);
      return storedValue ? JSON.parse(storedValue) : initialValue;
    }
    return initialValue;
  });

  useEffect(() => {
    if (enableStorage) {
      localStorage.setItem(`${key}_${variant}`, JSON.stringify(settings));
    }
  }, [key, variant, settings, enableStorage]);

  const createSetting = (settingKey, value) => {
    if (settings.hasOwnProperty(settingKey)) {
      throw new Error(`Datagrid V3 useTableSettings: setting key "${settingKey}" already exists for variant "${variant}"`);
    }
    setSettings((prevSettings) => ({
      ...prevSettings,
      [settingKey]: value,
    }));
  };

  const updateSetting = (settingKey, value) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [settingKey]: value,
    }));
  };

  const readSetting = (settingKey) => {
    return settings[settingKey];
  };

  const switchVariant = (newVariant) => {
    setVariant(newVariant);
    if (enableStorage) {
      const storedValue = localStorage.getItem(`${key}_${newVariant}`);
      setSettings(storedValue ? JSON.parse(storedValue) : initialValue);
    } else {
      setSettings(initialValue);
    }
  };

  const readVariant = (variantName) => {
    if (enableStorage) {
      const storedValue = localStorage.getItem(`${key}_${variantName}`);
      return storedValue ? JSON.parse(storedValue) : initialValue;
    }
    return initialValue;
  };

  const writeVariant = (variantName, variantSettings) => {
    if (enableStorage) {
      localStorage.setItem(`${key}_${variantName}`, JSON.stringify(variantSettings));
    }
  };

  const listVariants = () => {
    if (enableStorage) {
      const variantKeys = Object.keys(localStorage).filter((key) => key.startsWith(`${key}_`));
      const variants = variantKeys.map((key) => key.replace(`${key}_`, ''));
      return variants;
    }
    return [];
  };

  return [settings, createSetting, updateSetting, readSetting, switchVariant, readVariant, writeVariant, listVariants];
};

export default useTableSettings;