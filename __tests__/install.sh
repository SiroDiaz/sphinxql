#!/bin/sh

case $SEARCH_BUILD in
  MANTICORE2)
    wget --quiet -O search.deb https://github.com/manticoresoftware/manticoresearch/releases/download/2.8.2/manticore_2.8.2-190402-4e81114-release-stemmer.trusty_amd64-bin.deb
    dpkg -x search.deb .
    ;;
  MANTICORE3)
    wget --quiet -O search.deb https://github.com/manticoresoftware/manticoresearch/releases/download/3.0.0/manticore_3.0.0-190509-95141ec-release-stemmer.trusty_amd64-bin.deb
    dpkg -x search.deb .
    ;;
esac
