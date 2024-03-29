export class Sessions {
  constructor() {
    this._sessionLabel = document.querySelector("#session-label");
    this._sessionListButton = document.querySelector("#btn-session-list");
    this._sessionsDropdown = document.querySelector("#sessions-dropdown");

    this._selectedSession = null;
    this._sessionsObject = null;

    this.init();
  }

  getSelectedSession() {
    return this._selectedSession;
  }

  updateSessionLabel() {
    if (!this._sessionLabel) return;
    this._sessionLabel.innerText = this._selectedSession?.name ?? "";
  }

  updateOnStartup() {
    if (!this._sessionsObject) return;

    // console.log(this._sessionsObject.length);

    if (this._sessionsObject.length <= 1) {
      this._sessionListButton.style.display = "none";
    }

    let sessionKey = window.accounts.getDefaultAccount()?.session;

    if (!sessionKey && this._sessionsObject.length > 0)
      sessionKey = this._sessionsObject[0].key;
    if (!sessionKey) sessionKey = window.lightdm?.default_session;

    this._selectedSession =
      this._sessionsObject.find((el) => el.key == sessionKey) ?? null;

    this.updateSessionLabel();
  }

  setSessionList() {
    if (!this._sessionsDropdown || !this._sessionsObject) return;

    this._sessionsDropdown.innerHTML = "";

    for (const v of this._sessionsObject) {
      const name = v.name;
      const li = document.createElement("li");
      const button = document.createElement("button");

      button.classList.add("btn");
      button.innerText = name;
      button.addEventListener("click", () => {
        this._selectedSession = v;
        this.updateSessionLabel();
        this._sessionsDropdown.classList.toggle("hide");
      });

      li.appendChild(button);
      this._sessionsDropdown.appendChild(li);
    }
  }

  setKey() {
    this._sessionsDropdown?.addEventListener("keydown", (ev) => {
      if (ev.keyCode == 27) {
        this._sessionsDropdown?.classList.add("hide");
        this._sessionListButton?.focus();
      }
    });

    document
      .querySelector("#bottom-container")
      ?.addEventListener("click", (ev) => {
        if (!this._sessionsDropdown) return;
        if (
          ev.target == this._sessionListButton ||
          ev.target.parentElement == this._sessionListButton
        ) {
          this._sessionsDropdown.classList.toggle("hide");
        } else if (
          ev.target != this._sessionsDropdown &&
          ev.target.closest(".dropdown") == null
        ) {
          this._sessionsDropdown.classList.add("hide");
        }
      });

    document
      .querySelector("#bottom-container")
      ?.addEventListener("focusin", () => {
        if (!this._sessionsDropdown) return;
        if (
          !this._sessionsDropdown.contains(document.activeElement) &&
          document.activeElement != this._sessionListButton
        ) {
          this._sessionsDropdown.classList.add("hide");
        }
      });
  }

  init() {
    if (!window.lightdm) return;
    this._sessionsObject = window.lightdm.sessions;
    this.updateOnStartup();
    this.setSessionList();
    this.setKey();
  }
}
