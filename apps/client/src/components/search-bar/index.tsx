import { Search } from '@mui/icons-material';
import { TextField, InputAdornment } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  fullWidth?: boolean;
}

export default function SearchBar({
  value,
  onChange,
  placeholder,
  fullWidth = true,
}: SearchBarProps) {
  const { t } = useTranslation('common');

  return (
    <TextField
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder || t('actions.search')}
      size="small"
      fullWidth={fullWidth}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        },
      }}
    />
  );
}
