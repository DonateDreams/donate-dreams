const EVM_ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;

export const isValidAddress = (address) => {
  if (typeof address !== 'string') {
    return false;
  }

  const cleanAddress = address.trim();

  return EVM_ADDRESS_REGEX.test(cleanAddress);
};

export const normalizeAddress = (address) => {
  if (typeof address !== 'string') {
    return '';
  }

  return address.trim();
};

export const isEmptyAddress = (address) => {
  return !address || !address.trim();
};