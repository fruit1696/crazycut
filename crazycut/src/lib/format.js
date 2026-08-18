export const formatINR = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;
export const formatINRMeter = (n) => `${formatINR(n)}/m`;