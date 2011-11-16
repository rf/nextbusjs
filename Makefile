.PHONY: test docs

test :
	vows --spec ./test/*.js

docs :
	mkdir -p build/docs/
	NaturalDocs -i lib/ -i docs/ -o html build/docs/ -p docs/
