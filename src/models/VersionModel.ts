interface VersionType {
  major: number;
  minor: number;
  patch: number;
}

export class Version {
  private major: number;
  private minor: number;
  private patch: number;

  constructor({ major = 0, minor = 0, patch = 0 }: VersionType) {
    this.major = major;
    this.minor = minor;
    this.patch = patch;
  }

  get version() {
    return `${this.major}.${this.minor}.${this.patch}`;
  }
}
