import React from 'react';
import { Autocomplete, Checkbox, TextField } from '@mui/material';
import { AggregatedVariablesOptionsKeys, RawVariablesOptionsKeys } from '../measurement/MeasurementSection.tsx';
import {
    AggregatedVariableLabelMap,
    AggregatedVariables,
    RawVariableLabelMap,
    RawVariables,
} from '../../constants/variableConstants.ts';

interface VariableAutoCompleteProps {
    selectedVariables: (RawVariablesOptionsKeys | AggregatedVariablesOptionsKeys)[];
    onChange: (variables: (RawVariablesOptionsKeys | AggregatedVariablesOptionsKeys)[]) => void;
    variableOptions: (RawVariablesOptionsKeys | AggregatedVariablesOptionsKeys)[];
}

const mapVariableOptions = (variableOptions: (RawVariablesOptionsKeys | AggregatedVariablesOptionsKeys)[]) => {
    return variableOptions.map((key) => {
        const label =
            RawVariableLabelMap[key as keyof RawVariables] ||
            AggregatedVariableLabelMap[key as keyof AggregatedVariables] ||
            '';
        return [key, label] as [string, string];
    });
};

const CustomVariableAutoComplete: React.FC<VariableAutoCompleteProps> = ({
    selectedVariables,
    onChange,
    variableOptions,
}) => {
    const allOptionKey = 'all';
    const optionsWithLabels = [[allOptionKey, 'All'], ...mapVariableOptions(variableOptions)];

    return (
        <Autocomplete
            multiple
            options={optionsWithLabels}
            getOptionLabel={(option) => (option ? option[1] : '')}
            disableCloseOnSelect
            value={selectedVariables.map((key) => optionsWithLabels.find(([optionKey]) => optionKey === key) || null)}
            onChange={(_, variables) => {
                const filteredVariables = variables.filter((item) => item !== null);
                const keys = filteredVariables.map((item) => item[0]);
                onChange(keys as (RawVariablesOptionsKeys | AggregatedVariablesOptionsKeys)[]);
            }}
            renderOption={(
                props: React.HTMLAttributes<HTMLLIElement> & {
                    key: string;
                },
                option,
                { selected }
            ) => {
                if (!option) {
                    return null;
                }

                const label = option[1];
                const { key: key, ...rest } = props;

                return (
                    <li key={key} {...rest}>
                        <Checkbox
                            style={{ marginRight: 8 }}
                            checked={selected || selectedVariables.includes(allOptionKey)}
                        />
                        {label}
                    </li>
                );
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Variables"
                    placeholder={
                        selectedVariables.includes(allOptionKey)
                            ? 'All Variables Selected'
                            : `${String(selectedVariables.length)} Variables Selected`
                    }
                />
            )}
            slotProps={{
                chip: {
                    sx: {
                        display: 'none',
                    },
                },
            }}
            sx={{ width: 300 }}
        />
    );
};

export default CustomVariableAutoComplete;
