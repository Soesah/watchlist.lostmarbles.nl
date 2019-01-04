export class LocalStorageService {
  store(name: string, value: string): void {
    localStorage.setItem(name, value);
  }

  storeJSON(name: string, value: string): void {
    this.store(name, JSON.stringify(value));
  }

  has(name: string): boolean {
    return this.get(name) !== null;
  }

  get(name: string): string | null {
    return localStorage.getItem(name);
  }

  getJSON(name: string): object {
    const data = this.get(name);
    return data ? JSON.parse(data) : {};
  }

  delete(name: string): void {
    return localStorage.removeItem(name);
  }
}
