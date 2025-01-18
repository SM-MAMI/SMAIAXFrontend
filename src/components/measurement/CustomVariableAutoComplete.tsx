import React from 'react';
import { Autocomplete, Checkbox, TextField } from '@mui/material';
import { RawVariableLabelMap, RawVariables } from '../../constants/variableConstants.ts';
import { RawVariablesOptionsKeys } from './MeasurementSection.tsx';

interface VariableAutoCompleteProps {
    selectedVariables: RawVariablesOptionsKeys[];
    onChange: (variables: RawVariablesOptionsKeys[]) => void;
}

const CustomVariableAutoComplete: React.FC<VariableAutoCompleteProps> = ({ selectedVariables, onChange }) => {
    const variableOptions = Object.entries(RawVariableLabelMap) as [keyof RawVariables, string][];
    const allOption: [RawVariablesOptionsKeys, string] = ['all', 'All'];

    return (
        <Autocomplete
            multiple
            options={[allOption, ...variableOptions]}
            getOptionLabel={(option) => (option ? option[1] : '')}
            disableCloseOnSelect
            value={selectedVariables.map((key) =>
                key === 'all' ? allOption : variableOptions.find(([optionKey]) => optionKey === key)
            )}
            onChange={(_, variables) => {
                const filteredVariables = variables.filter(
                    (item): item is [RawVariablesOptionsKeys, string] => item !== undefined
                );
                const keys: RawVariablesOptionsKeys[] = filteredVariables.map(([key]) => key);
                onChange(keys);
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
                        <Checkbox style={{ marginRight: 8 }} checked={selected || selectedVariables.includes('all')} />
                        {label}
                    </li>
                );
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Variables"
                    placeholder={
                        selectedVariables.includes('all')
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
