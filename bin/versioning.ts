import * as fs from 'fs';
import { Version } from './version.model';

const command = process.argv[2];

const COMMAND_GET = 'get';
const COMMAND_PREVIEW_MAJOR = 'preview:major';
const COMMAND_PREVIEW_MINOR = 'preview:minor';
const COMMAND_PREVIEW_PATCH = 'preview:patch';
const COMMAND_MAJOR = 'major';
const COMMAND_MINOR = 'minor';
const COMMAND_PATCH = 'patch';

class Versioning {

  private path: string  = '../src/version.json';
  private version: Version;

  constructor() {

    const contents: string = fs.readFileSync(this.path, {
      encoding: 'utf-8',
    });
    const data = JSON.parse(contents);

    this.version = new Version(data);

    this.process();

  }

  public process() {
    switch (command) {
      case COMMAND_GET:
        this.getVersion();
        return;
      case COMMAND_PREVIEW_MAJOR:
      case COMMAND_MAJOR:
        this.version.updateMajor();
        break;
      case COMMAND_PREVIEW_MINOR:
      case COMMAND_MINOR:
        this.version.updateMinor();
        break;
      case COMMAND_PREVIEW_PATCH:
      case COMMAND_PATCH:
        this.version.updatePatch();
        break;
    }

    if ([COMMAND_MAJOR, COMMAND_MINOR, COMMAND_PATCH].includes(command)) {
      this.update();
    } else {
      this.getVersion();
    }
  }

  private update() {
    fs.writeFileSync(this.path, this.version.json());
  }

  private getVersion() {
    process.stdout.write(this.version.version);
  }

}

const _ = new Versioning();
