export enum Responses {
  Successful = 200,
  Created = 201,
  NoContent = 204
}

export enum Colors {
  Red = "#F44336",
  Pink = "#E91E63",
  Purple = "#9C27B0",
  DeepPurple = "#673AB7",
  Indigo = "#3F51B5",
  Blue = "#2196F3",
  LightBlue = "#03A9F4",
  Cyan = "#00BCD4",
  Teal = "#009688",
  Green = "#4CAF50",
  LightGreen = "#8BC34A",
  Lime = "#CDDC39",
  Yellow = "#FFEB3B",
  Amber = "#FFC107",
  Orange = "#FF9800",
  Brown = "#795548",
  Grey = "#9E9E9E",
  BlueGrey = "#607D8B"
}

export namespace Colors {
  export function values() {
    return Object.keys(Colors).filter(
      (type) => isNaN(<any>type) && type !== 'values'
    );
  }
}
