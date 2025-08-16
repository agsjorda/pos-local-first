declare module '@nozbe/watermelondb' {
  import { Model as BaseModel } from '@nozbe/watermelondb';
  export { Database } from '@nozbe/watermelondb';
  export { default as Collection } from '@nozbe/watermelondb/Collection';
  export { default as Model } from '@nozbe/watermelondb/Model';
  export { date, readonly, field } from '@nozbe/watermelondb/decorators';
}

declare module '@nozbe/watermelondb/adapters/sqlite' {
  import { Database } from '@nozbe/watermelondb';
  export default class SQLiteAdapter {
    constructor(options: {
      schema: any;
      migrations?: any;
      jsi?: boolean;
      onSetUpError?: (error: Error) => void;
    });
  }
}

declare module '@nozbe/with-observables' {
  import { Observable } from 'rxjs';
  type InputProps = { [key: string]: any };
  type ObservableConvertible<T> = Observable<T> | Promise<T> | T;
  type Enhancement<InputType extends InputProps, ObservablesType extends InputProps> = (
    props: InputType,
  ) => { [Key in keyof ObservablesType]: ObservableConvertible<ObservablesType[Key]> };

  export default function withObservables<
    InputType extends InputProps,
    ObservablesType extends InputProps,
  >(
    triggerProps: (keyof InputType)[],
    getObservables: Enhancement<InputType, ObservablesType>,
  ): (
    component: React.ComponentType<InputType & ObservablesType>,
  ) => React.ComponentType<InputType>;
}
