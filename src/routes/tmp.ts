const tmp = {
  titi: "toto",
  get: (arg1: string) => {
    console.log("gboDebug: original tmp get func");
  },
};
export { tmp };
