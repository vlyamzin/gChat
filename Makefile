DIST_DIR=dist
VERSION=0.1.0

.PHONY: install
install:
	@npm install && echo -e "\nAll development dependencies have been installed successfully!\n"

.PHONY: start
start:
	@echo -e "\nStarting the app...\n" && mkdir -p $(DIST_DIR) && cp src/index.html dist/ && npm start

#.PHONY: build-rpm
#build-rpm:
#	./node_modules/.bin/electron-builder --linux rpm
#
#.PHONY: build-deb
#build-deb:
#	./node_modules/.bin/electron-builder --linux deb
#
#.PHONY: build-pacman
#build-pacman:
#	./node_modules/.bin/electron-builder --linux pacman
#
#.PHONY: build-win
#build-win:
#	./node_modules/.bin/electron-builder --win
#
#.PHONY: build-linux
#build-linux:
#	./node_modules/.bin/electron-builder --linux
#
#.PHONY: build-all
#build-all:
#	./node_modules/.bin/electron-builder --linux && \
#	./node_modules/.bin/electron-builder --win

.PHONY: set-version
set-version:
	cd src && npm version $(VERSION)

.PHONY: clean
clean:
	@rm -rf $(DIST_DIR) && printf "\nBuild artifacts (from './$(DIST_DIR)') have been deleted successfully!\n\n"
