class Logger {
  private initial: string;

  #now() {
    return new Date().toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  }

  #formatJSON(object: any) {
    return JSON.stringify(object, null, 2);
  }

  #formatMessage(message: any) {
    return typeof message === "string" ? message : this.#formatJSON(message);
  }

  #formatAdditional(additional: string) {
    return additional ? ` - ${additional}` : "";
  }

  #formatLog(message: any, additional = "") {
    return `(${this.#now()}) [${this.initial}${this.#formatAdditional(
      additional
    )}] --> ${this.#formatMessage(message)}`;
  }

  constructor(initial: string) {
    this.initial = initial;
  }

  info(message: any, additional = "") {
    console.log(this.#formatLog(message, additional));
  }
}

export default Logger;
