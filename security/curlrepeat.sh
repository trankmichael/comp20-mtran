#!/bin/bash
for i in `seq 1 100000`;
do
        curl --data "login=TEST22&lat=999999&lng=999999" damp-tundra-5879.herokuapp.com/sendLocation
done   
