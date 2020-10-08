DIST_DIR=dist
VERSION=1.0.0
INDEX_FILE=src/index.html
ASSETS=build/icons
DEV_UPDATE=dev-app-update.yml
PROD_ENV_FILE=src/environment.prod.ts
ENV_FILE=src/environment.ts

.PHONY: install
install:
	@npm install && \
	mkdir compiled && \
	npm run tsc && \
	echo -e "\nAll development dependencies have been installed successfully!\n"

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
	cp ${PROD_ENV_FILE} ${ENV_FILE} && npm run build && ./node_modules/.bin/electron-builder --linux rpm
#
.PHONY: build-deb
build-deb:
	cp ${PROD_ENV_FILE} ${ENV_FILE} && npm run build && ./node_modules/.bin/electron-builder --linux deb
#
.PHONY: build-pacman
build-pacman:
	cp ${PROD_ENV_FILE} ${ENV_FILE} && npm run build &&  ./node_modules/.bin/electron-builder --linux pacman
#
.PHONY: build-win
build-win:
	cp ${PROD_ENV_FILE} ${ENV_FILE} && npm run build && ./node_modules/.bin/electron-builder --win
#
.PHONY: build-linux
build-linux:
	cp ${PROD_ENV_FILE} ${ENV_FILE} && npm run build && ./node_modules/.bin/electron-builder --linux
#
.PHONY: build-mac
build-mac:
	cp ${PROD_ENV_FILE} ${ENV_FILE} && npm run build && ./node_modules/.bin/electron-builder --mac
#
.PHONY: build-all
build-all:
	cp ${PROD_ENV_FILE} ${ENV_FILE} && \
	npm run build && \
 	./node_modules/.bin/electron-builder -mwl --publish always
#
.PHONY: build-lw-and-deploy
build-lw-and-deploy:
	cp ${PROD_ENV_FILE} ${ENV_FILE} && \
	npm run build && \
 	./node_modules/.bin/electron-builder -wl --publish always
#
.PHONY: set-version
set-version:
	npm version $(VERSION)

.PHONY: clean
clean:
	@rm -rf $(DIST_DIR) && printf "\nBuild artifacts (from './$(DIST_DIR)') have been deleted successfully!\n\n"
