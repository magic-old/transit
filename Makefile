NODE_BIN=node_modules/.bin/

.PHONY: \
	build \
	clean \
	lint \
	test

dev: lint
	@echo 'babelify package and watch for changes'
	@${NODE_BIN}babel \
		src/index.js \
		--watch \
		--out-file index.js \
		--experimental

build: lint
	@echo 'babelify package'
	@${NODE_BIN}babel \
		src/index.js \
		--out-file index.js \
		--experimental

test: build
	@echo 'remove and readd test directory'
	@rm -rf test/*
	@mkdir test/ -p

	@echo 'building test source'
	@${NODE_BIN}babel \
		src/test/ \
		--out-dir test/ \
		--experimental
	${NODE_BIN}mocha \
		./test/index.js \
		--reporter spec \
		--ui bdd

lint:
	@${NODE_BIN}eslint \
		./src/

lint-fix:
	@${NODE_BIN}eslint \
		--fix \
		./src/

clean:
	rm -rf \
		./index.js \
		./index.js.map \
		./test

help:
	@echo " \n\
make [task] \n\
\n\
running make without task starts a dev env \n\
\n\
dev - start dev env \n\
build - build library \n\
clean - remove build library and test files \n\
test - run tests \n\
"
