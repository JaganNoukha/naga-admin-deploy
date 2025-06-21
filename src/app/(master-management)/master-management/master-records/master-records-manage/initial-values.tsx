
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FieldType,
  FieldTypes,
  FieldValueType,
  RELATIONSHIP_TYPES,
} from '@/constants/master-schema';
import { Switch } from '@/components/ui/switch';


interface Field {
  id: string;
  name: string;
  type: FieldTypes;
  fieldType: FieldValueType | '';
  value: string;
  masterId?: string;
  relation?: string;
  isRequired: boolean;
  isUnique: boolean;
}

const FieldForm = ({
  field,
  onChange,
  schemas,
}: {
  field: Field;
  onChange: (field: Field) => void;
  onRemove: (id: string) => void;
  isFirst: boolean;
  schemas: any;
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">

        {field?.type === FieldTypes.String && (
          <div className="space-y-2">
           <Label>{field?.name}</Label>
            <Input
              placeholder="Enter Field Name"
              value={field.value}
              onChange={(e) =>
                onChange({ ...field, value: e.target.value })
              }
            />
          </div>
        )}
        {field?.type === FieldTypes.Boolean && (
          <div className="space-y-2">
            <Switch
              checked={field.value === 'true'}
              onCheckedChange={(checked) =>
                onChange({ ...field, value: checked.toString() })
              }
              label={field?.name}
            />
          </div>
        )}
        {field?.type === FieldTypes.Number && (
          <div className="space-y-2">
           <Label>{field?.name}</Label>
            <Input
              placeholder="Enter Field Name"
              value={field.value}
              onChange={(e) =>
                onChange({ ...field, value: e.target.value })
              }
              type='number'
            />
          </div>
        )}

        {field.fieldType === FieldType.Master && (
          <div className="space-y-2">
            <Label>Master</Label>
            <Select
              value={field.masterId}
              onValueChange={(value) => onChange({ ...field, masterId: value })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a Master" />
              </SelectTrigger>
              <SelectContent>
                {schemas.data?.data.map((schema: any) => (
                  <SelectItem key={schema.name} value={schema.name}>
                    {schema.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {field.fieldType === FieldType.Master && (
          <div className="space-y-2">
            <Label>Relation</Label>
            <Select
              value={field.relation}
              onValueChange={(value) => onChange({ ...field, relation: value })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a relation type" />
              </SelectTrigger>
              <SelectContent>
                {RELATIONSHIP_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </div>
  );
};



export { FieldForm };
