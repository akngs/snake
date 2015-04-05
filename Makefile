SHELL := /bin/bash

VENV := snake
ANACONDA_HOME := $(shell conda info | grep "root environment" | awk '{FS=" "; print $$4}')
VENV_HOME := $(ANACONDA_HOME)/envs/$(VENV)/bin

help:
	@echo develop: initialize development environment
	@echo product: initialize production environment
	@echo test: run tests

common:
	# Create anaconda environment
	conda info -e | grep --quiet $(VENV) ; \
	if [ $$? -eq 1 ] ; then \
		conda create --yes -n $(VENV) python=2.7.9 pip ; \
	fi

	# Install external dependencies using anaconda
	if [ -s $(CURDIR)/requirements.conda.txt ] ; then \
		conda install --yes -n $(VENV) `cat $(CURDIR)/requirements.conda.txt` ; \
	fi

	# Install external dependencies using pip
	if [ -s $(CURDIR)/requirements.txt ] ; then \
    	$(VENV_HOME)/pip install -r `pwd`/requirements.txt ; \
	fi

	# Install bower components
	bower install

product: common
	# Install external dependencies using anaconda
	if [ -s $(CURDIR)/requirements.production.conda.txt ] ; then \
		conda install --yes -n $(VENV) `cat $(CURDIR)/requirements.production.conda.txt` ; \
	fi

	# Install external dependencies using pip
	if [ -s $(CURDIR)/requirements.production.txt ] ; then \
		$(VENV_HOME)/pip install -r `pwd`/requirements.production.txt ; \
	fi

    # Perform "migrate" and "collectstatic"
	source activate $(VENV) ; \
	cd $(CURDIR)/djangohome ; \
	export DJANGO_SETTINGS_MODULE=snake.settings_production ;\
	python manage.py migrate ; \
	python manage.py collectstatic --noinput

develop: common
	# Install test dependencies
	conda install --yes -n $(VENV) nose

test:
	source activate $(VENV) ; nosetests -w approot --with-doctest

clean:
	git clean -Xfd
