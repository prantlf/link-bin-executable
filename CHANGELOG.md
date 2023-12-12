## [1.0.2](https://github.com/prantlf/link-bin-executable/compare/v1.0.1...v1.0.2) (2023-12-12)


### Bug Fixes

* Fix missing declaration of wrioteFile ([56e637b](https://github.com/prantlf/link-bin-executable/commit/56e637b3170db5706588bd0fc9608a0b3eb566e1))

## [1.0.1](https://github.com/prantlf/link-bin-executable/compare/v1.0.0...v1.0.1) (2023-12-12)


### Bug Fixes

* Install .cmd and .ps1 files on Windows ([efff95d](https://github.com/prantlf/link-bin-executable/commit/efff95da5b7ee18c615e72bc731f34a949e83faf))

# [1.0.0](https://github.com/prantlf/link-bin-executable/compare/v0.3.1...v1.0.0) (2023-12-12)


### Features

* Use .cmd and .ps1 files on Windows ([6d8f80a](https://github.com/prantlf/link-bin-executable/commit/6d8f80a7a01d51e421832fb950dea211a1e56b00))


### BREAKING CHANGES

* Although the previous version did not work on Windows
in my tests, for somebdy it might. The new version creates .cmd and .ps1
files instead of the links. The junction will not exist in .bin after
installing a package. Otherwise the functionality did not change. The
binary can be run just by the file name with no file extension.

## [0.3.1](https://github.com/prantlf/link-bin-executable/compare/v0.3.0...v0.3.1) (2023-11-04)


### Bug Fixes

* Fix local bin detection when installling ([0db0151](https://github.com/prantlf/link-bin-executable/commit/0db0151c11abd01c53431d36a43ec505f3634c74))

# [0.3.0](https://github.com/prantlf/link-bin-executable/compare/v0.2.0...v0.3.0) (2023-11-04)


### Features

* Add verbose option to perform debug logging on stdout ([8fdc993](https://github.com/prantlf/link-bin-executable/commit/8fdc993012cc881817bcf26520cc4e019ac24663))

# [0.2.0](https://github.com/prantlf/link-bin-executable/compare/v0.1.1...v0.2.0) (2023-11-01)


### Features

* Allow specifying multiple links in the runtime too ([79e5e94](https://github.com/prantlf/link-bin-executable/commit/79e5e9411aaa71d313ae84df91ded93d23a783c8))

## [0.1.1](https://github.com/prantlf/link-bin-executable/compare/v0.1.0...v0.1.1) (2023-11-01)


### Bug Fixes

* Replace broken links as well ([c6bd347](https://github.com/prantlf/link-bin-executable/commit/c6bd34752050e3bff58af1a4974b248504d3bdc5))

# [0.1.0](https://github.com/prantlf/link-bin-executable/compare/v0.0.1...v0.1.0) (2023-11-01)


### Features

* Allow specifying multiple links ([4890f73](https://github.com/prantlf/link-bin-executable/commit/4890f73934d7c35ca216e40df1050817e6fa8ba4))

## 2023-10-27 (0.0.1)

Initial release
