#!/bin/sh

case $SEARCH_BUILD in
  SPHINX2)
    wget --quiet http://ppa.launchpad.net/builds/sphinxsearch-rel22/ubuntu/dists/`lsb_release -cs`/main/binary-amd64/Packages.gz
    gzip -d Packages.gz
    SPHINX_DEB=`grep -m1 Filename Packages | cut -f2 -d' '`
    wget --quiet -O search.deb http://ppa.launchpad.net/builds/sphinxsearch-rel22/ubuntu/${SPHINX_DEB}
    dpkg -x search.deb .
    ;;
  SPHINX3)
    wget --quiet http://sphinxsearch.com/files/sphinx-3.0.3-facc3fb-linux-amd64.tar.gz
    tar zxvf sphinx-3.0.3-facc3fb-linux-amd64.tar.gz
    ;;
  MANTICORE2)
    wget --quiet -O search.deb https://github.com/manticoresoftware/manticoresearch/releases/download/2.8.2/manticore_2.8.2-190402-4e81114-release-stemmer.trusty_amd64-bin.deb
    dpkg -x search.deb .
    ;;
  MANTICORE3)
    wget --quiet -O search.deb https://github.com/manticoresoftware/manticoresearch/releases/download/3.0.0/manticore_3.0.0-190509-95141ec-release-stemmer.trusty_amd64-bin.deb
    dpkg -x search.deb .
    ;;
esac
