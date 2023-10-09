module.exports = {
    apps: [
        {
            name: 'mi-app',
            script: 'bin/index.js',
            instances: 1,
            exec_mode: 'cluster',
            autorestart: true,
            watch: false,
            max_memory_restart: '300M',
            env: {
                NODE_ENV: 'production'
            },
        }
    ],
};
  