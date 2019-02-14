export class Version {

  private major: number;
  private minor: number;
  private patch: number;

  constructor({ major = 0, minor = 0, patch = 0 }) {

    this.major = major;
    this.minor = minor;
    this.patch = patch;

  }

  public json(): string {

    const json = JSON.stringify({
      major: this.major,
      minor: this.minor,
      patch: this.patch,
    });

    return json;

  }

  public get version() {
    return `${this.major}.${this.minor}.${this.patch}`;
  }

  public updateMajor(): string {

    this.major += 1;
    this.minor = 0;
    this.patch = 0;

    return this.json();

  }

  public updateMinor(): string {

    this.minor += 1;
    this.patch = 0;

    return this.json();

  }

  public updatePatch(): string {

    this.patch += 1;

    return this.json();

  }

}
