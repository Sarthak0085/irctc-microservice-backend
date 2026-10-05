import packageJson from '../../package.json'  with { type: 'json' };

const config = {
  SERVICE_NAME: packageJson?.name,
  PORT: Number(process.env.PORT || '4001'),
  NODE_ENV: process.env.NODE_ENV || 'development',
  LOG_LEVEL: process.env.LOG_LEVEL || 'debug',
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS,
};

export { config };
