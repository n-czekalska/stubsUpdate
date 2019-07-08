import * as program from "commander";
import * as fse from "fs-extra";
import { Logger } from "./Logger";
import { updateStub } from "./stubUpdate";

export function start(args: string[]) {

    program.description("Updates stub data with new ref data objects instead of key")
        .option("-d --data <data>", "Location of Json file with stub data")
        .option("-a --attribute <attribute>", "Locations of attributes file with their new structure");

    program.parse(args);

    const NO_COMMAND_SPECIFIED = (!program.data || !program.attribute);

    if (NO_COMMAND_SPECIFIED) {
        program.help();
    }
    if (!fse.existsSync(program.data)) {
        Logger.warn("Incorrect stub data file or directory: " + program.data);
        return;
    }
    if (!fse.existsSync(program.attribute)) {
        Logger.warn("Incorrect data dictionary file or directory: " + program.attribute);
        return;
    }
    updateStub(program.data, program.attribute);
}