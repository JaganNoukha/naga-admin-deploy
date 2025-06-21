export type FieldValueType = (typeof FIELD_VALUE_TYPES)[number];
export enum FieldType {
  Boolean = 'Boolean',
  String = 'String',
  Number = 'Number',
  Date = 'Date',
  Master = 'Master',
}
export const FIELD_VALUE_TYPES = Object.values(FieldType);

export type RelationshipType = (typeof RELATIONSHIP_TYPES)[number];
export const RELATIONSHIP_TYPES = [
  {
    label: 'One to One',
    value: 'oneToOne',
  },
  {
    label: 'One to Many',
    value: 'oneToMany',
  },
  {
    label: 'Many to One',
    value: 'manyToOne',
  },
  {
    label: 'Many to Many',
    value: 'manyToMany',
  },
] as const;

export enum FieldTypes {
  Boolean = 'boolean',
  String = 'string',
  Number = 'number',
  Date = 'date',
  Master = 'master',
}