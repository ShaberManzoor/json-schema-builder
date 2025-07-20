"use client";

import { SchemaField } from "@/components/SchemaField";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { generateJSON } from "@/utils/generateJson";
import { v4 as uuid } from "uuid";
import { useState } from "react";

type FieldType = "string" | "number" | "nested";

interface Field {
  id: string;
  key: string;
  type: FieldType;
  value?: string;
  children?: Field[];
}

interface FormValues {
  fields: Field[];
}


export default function Home() {
  const methods = useForm<FormValues>({
    defaultValues: {
      fields: [],
    },
  });


  const { control, watch } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "fields",
  });

  const [jsonOutput, setJsonOutput] = useState({});

  const addRootField = () => {
    append({ id: uuid(), key: "", type: "string", children: [] });
  };

  const handlePreview = () => {
    const values = watch("fields");
    const output = generateJSON(values);
    setJsonOutput(output);
  };

  return (
    <FormProvider {...methods}>
      <main className="p-8 space-y-6">
        <h1 className="text-2xl font-bold">JSON Schema Builder</h1>

        {fields.map((field, idx) => (
          <SchemaField
            key={field.id}
            nestIndex={[idx]}
            field={field}
            removeField={() => remove(idx)}
            path={`fields.${idx}`}
          />
        ))}

        <div className="space-x-4">
          <Button onClick={addRootField}>Add Field</Button>
          <Button onClick={handlePreview} variant="outline">
            Preview JSON
          </Button>
        </div>

        <div>
          <h2 className="text-lg font-semibold">JSON Output:</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-[300px] text-sm">
            {JSON.stringify(jsonOutput, null, 2)}
          </pre>
        </div>
      </main>
    </FormProvider>
  );
}
