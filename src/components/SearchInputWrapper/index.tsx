import React, { useState, useEffect, ChangeEvent } from 'react';

import FormGroupWrapper from '../form/FormGroupWrapper';
import SearchIcon from '../../assets/svg/SearchIcon';

import './index.scss';

interface IProps {
  searchValue: string;
  handleSearch: (value: string) => void; // eslint-disable-line
}

const SearchInputWrapper: React.FC<IProps> = ({
  searchValue,
  handleSearch,
}) => {
  const [value, setValue] = useState<string>('');

  useEffect(() => {
    setValue(searchValue);
  }, []);

  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setValue(evt.target.value);
    handleSearch(evt.target.value);
  };

  useEffect(() => {
    if (!searchValue) {
      setValue('');
      handleSearch('');
    }
  }, [searchValue]);

  return (
    <div className='search-container'>
      <div className='d-md-flex d-block search-bar'>
        <FormGroupWrapper
          hasLabel={false}
          placeholder='Search...'
          type='text'
          autoComplete='off'
          name='search'
          onChange={handleChange}
          value={value}
          error={undefined}
          elementRender={<SearchIcon />}
        />
      </div>
    </div>
  );
};

export default SearchInputWrapper;
