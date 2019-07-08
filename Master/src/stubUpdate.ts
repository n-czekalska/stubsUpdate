import * as fse from "fs-extra";
import { Logger } from "./Logger";

export function updateStub(stubFile: string, refenenceDataFile: string) {
  const undefinedTypes = new Array<string>();

  const stubData: string = fse.readJSONSync(stubFile);
  const copyStubData = deepCopy(stubData);
  const attributes: string = fse.readJSONSync(refenenceDataFile);

  const newStubData = mapAllAttributes(copyStubData, attributes, undefinedTypes);

  Logger.success("Stub data has been successfully updated");
  if (!fse.existsSync("./output")) {
    fse.mkdirSync("./output");
  }
  fse.writeJSONSync("./output/default-data.json", newStubData, { spaces: 2 });
  fse.writeJSONSync("./output/undefinedTypes.json", undefinedTypes, { spaces: 2 });
}

function mapAllAttributes(copyStubData: string, attributes: string, undefinedTypes: string[]) {
  Object.keys(copyStubData).forEach((key) => {
    if (copyStubData[key] instanceof Object
    && attributes[key] !== undefined) {
      copyStubData[key] = replaceValues(copyStubData[key], attributes[key]);
      return copyStubData;
      }
    if (copyStubData[key] instanceof Object) {
      copyStubData[key] = mapAllAttributes(copyStubData[key], attributes, undefinedTypes);
    }
    copyStubData[key] = mapReferenceType(key, attributes, copyStubData[key], undefinedTypes);
    return copyStubData;
  });
  return copyStubData;
}
function mapReferenceType(name: string, attributes: string, value: string, undefinedTypes: string[]) {
  if (name.includes("Type" || "Status") && attributes[name] === undefined && undefinedTypes.indexOf(name) === -1) {
    undefinedTypes.push(name);
    return name;
  }

  if (attributes[name] !== undefined && attributes[name][value] === undefined
    && undefinedTypes.indexOf(name + ": " + value) === -1) {
      const newValue = replaceValues(value, attributes[name]);
      if (newValue === value) {
      undefinedTypes.push(name + ": " + value);
    }
      return newValue;
  }

  if (attributes[name] !== undefined && attributes[name][value] !== undefined) {
    Logger.info("Updated " + name);
    return attributes[name][value];
  }
  return value;
}

function replaceValues(oldData, newData) {
  if (oldData instanceof Object) {
    return readObject(oldData, newData);
  } else {
    Object.keys(newData).forEach((key) => {
      const newValues = (Object as any).values(newData[key]);
      newValues.forEach((element) => {
        if (element.includes(oldData)) {
          oldData = newData[key];
          Logger.info("Updated " + key);
         }
        });
      });
    }
  return oldData;
}

function readObject(oldObject, newObject) {
  (Object as any).values(oldObject);
  Object.keys(newObject).forEach((key) => {
    const newValues = (Object as any).values(newObject[key]);
    if (oldObject.some((value) => newValues.indexOf(value) !== -1) ) {
      oldObject = newObject[key];
      Logger.info("Updated object " + key);
    }
   });
  return oldObject;
}

function deepCopy(obj) {
  let copy;

  if (obj == null || obj !== typeof "object") {
    return obj;
  }

  if (obj instanceof Date) {
    copy = new Date();
    copy.setTime(obj.getTime());
    return copy;
  }

  if (obj instanceof Array) {
    copy = [];
    for (let index = 0, len = obj.length; index < len; index++) {
      copy[index] = deepCopy(obj[index]);
    }
    return copy;
  }

  if (obj instanceof Object) {
    copy = {};
    for (const attr in obj) {
      if (obj.hasOwnProperty(attr)) {
        copy[attr] = deepCopy(obj[attr]);
      }
    }
    return copy;
  }

  throw new Error("Unable to copy object");
}
