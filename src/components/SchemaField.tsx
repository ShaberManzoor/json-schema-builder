"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Plus } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { v4 as uuid } from "uuid";

interface Props {
  nestIndex: number[];
  field: any;
  removeField: () => void;
  path: string;
}

export const SchemaField = ({ nestIndex, field, removeField, path }: Props) => {
  const { register, control, setValue, watch } = useFormContext();

  const fieldPath = `${path}`;
  const childrenPath = `${fieldPath}.children`;
  const typePath = `${fieldPath}.type`;

  const fieldType = watch(typePath);

  const {
    fields: childFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: childrenPath,
  });

  const handleAddNested = () => {
    append({ id: uuid(), key: "", type: "string", children: [] });
  };

  return (
    <div className="border rounded-lg p-4 space-y-4">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Field Key"
          {...register(`${fieldPath}.key`)}
          className="w-1/3"
        />

        <Select
          value={fieldType}
          onValueChange={(val: string) => setValue(typePath, val)}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="string">String</SelectItem>
            <SelectItem value="number">Number</SelectItem>
            <SelectItem value="nested">Nested</SelectItem>
          </SelectContent>
        </Select>

        {fieldType !== "nested" && (
          <Input
            placeholder="Value"
            {...register(`${fieldPath}.value`)}
            className="w-1/4"
          />
        )}
        
        <Button variant="destructive" onClick={removeField} size="icon">
          <Trash2 size={16} />
        </Button>
      </div>

      {fieldType === "nested" && (
        <div className="pl-4 border-l space-y-2">
          {childFields.map((child, idx) => (
            <SchemaField
              key={child.id}
              nestIndex={[...nestIndex, idx]}
              field={child}
              removeField={() => remove(idx)}
              path={`${childrenPath}.${idx}`}
            />
          ))}
          <Button onClick={handleAddNested} size="sm">
            <Plus size={16} className="mr-2" />
            Add Nested Field
          </Button>
        </div>
      )}
    </div>
  );
};
