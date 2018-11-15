const getConfigById = require('./config/get-config-by-id');
const getConfigs = require('./config/get-configs');
const getStorage = require('./storage');
const putFile = require('./put-file');
const deleteFile = require('./delete-file');
const deleteFiles = require('./delete-files');

module.exports = class BlobbyClient {
  constructor(argv, globalConfig) {
    this.argv = argv;
    this.config = globalConfig;
  }

  static getConfigs(argv) {
    return getConfigs(argv);
  }

  getConfig(configId) {
    return getConfigById(configId, this.argv);
  }

  getStorage(storageId, customConfig) {
    return getStorage(customConfig || this.config, storageId);
  }

  headFile(storage, fileKey, opts) {
    return new Promise((resolve, reject) => {
      storage.fetchInfo(fileKey, opts, (err, headers) => {
        if (err) return void reject(err);

        resolve(headers);
      });
    });
  }

  getFile(storage, fileKey, opts) {
    return new Promise((resolve, reject) => {
      storage.fetch(fileKey, opts, (err, headers, data) => {
        if (err) return void reject(err);

        resolve([headers, data]);
      });
    });
  }

  getFiles(storage, dirPath, opts) {
    return new Promise((resolve, reject) => {
      storage.list(dirPath, opts, (err, files, dirs, lastKey) => {
        if (err) return void reject(err);

        resolve([files, dirs, lastKey]);
      });
    });
  }

  putFile(storage, fileKey, file, opts) {
    return putFile(this, storage, fileKey, file, opts);
  }

  deleteFile(storage, fileKey, opts) {
    return deleteFile(this, storage, fileKey, opts);
  }

  deleteFiles(storage, fileKey, opts) {
    return deleteFiles(this, storage, fileKey, opts);
  }
}