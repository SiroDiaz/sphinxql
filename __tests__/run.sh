#!/bin/sh

case $SEARCH_BUILD in
  MANTICORE2)
    WORK=$HOME/search
    # gcc -shared -o data/test_udf.so ms_test_udf.c
    $WORK/usr/bin/searchd -c sphinx.conf
    ;;
  MANTICORE3)
    WORK=$HOME/search
    # gcc -shared -o data/test_udf.so ms_test_udf.c
    $WORK/usr/bin/searchd -c sphinx.conf
    ;;
esac