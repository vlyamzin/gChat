DIST_DIR=dist
VERSION=0.1.4
INDEX_FILE=src/index.html
ASSETS=build/icons
DEV_UPDATE=dev-app-update.yml

.PHONY: install
install:
	@npm install && echo -e "\nAll development dependencies have been installed successfully!\n"

.PHONY: start
start:
	@echo -e "\nStarting the app...\n" && \
		mkdir -p $(DIST_DIR)/debug && \
		cp -r compiled dist/debug && \
		cp -r ${ASSETS} dist/debug/compiled && \
		cp -r ${DEV_UPDATE} dist/debug/compiled && \
		npm start

.PHONY: build-rpm
build-rpm:
	npm run build && ./node_modules/.bin/electron-builder --linux rpm
#
.PHONY: build-deb
build-deb:
	npm run build && ./node_modules/.bin/electron-builder --linux deb --publish always
#
.PHONY: build-pacman
build-pacman:
	npm run build &&  ./node_modules/.bin/electron-builder --linux pacman
#
.PHONY: build-win
build-win:
	npm run build && ./node_modules/.bin/electron-builder --win
#
.PHONY: build-linux
build-linux:
	npm run build && ./node_modules/.bin/electron-builder --linux
#
.PHONY: build-all
build-all:
	npm run build && \
 	./node_modules/.bin/electron-builder --mac && \
	./node_modules/.bin/electron-builder --linux && \
	./node_modules/.bin/electron-builder --win

.PHONY: set-version
set-version:
	npm version $(VERSION)

.PHONY: clean
clean:
	@rm -rf $(DIST_DIR) && printf "\nBuild artifacts (from './$(DIST_DIR)') have been deleted successfully!\n\n"
