
## Table of contents

1. [Introduction]
2. [InstallPackages]
3. [Build]
4. [Usage]
5. [Examples]

## Introduction 
This utility contains a command line interface used to update individual stub data using a template to format the value in the stub response.
If a type is not found or given value of a type does not exist in the data dictionary it would not be replaced.

##Install Packages

In a command window, cd to the project folder where the package.json is located.
Run npm run install.
You should now be able to build and run the application.

##Build

Run npm run build to build the project. 

## Usage
Usage: stub [options]
Options: 
-d --data <data>            Json data file used by the stubs
-a --attribute <attribute>  List of attributes and their new structure

##Examples

The usage of the utility requires providing a path to a json file that has to be updated and path to a data dictionary(located in stubTemplate folder)

e.g. stub -d ./stubData/default-data.json -a ./stubTemplate/data-dictionary.json