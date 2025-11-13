'use client';

import { useState, Fragment } from 'react';
import { Combobox, Transition } from '@headlessui/react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { COUNTRIES, type Country } from '@/lib/countries';

interface CountryComboboxProps {
  value: string;
  onChange: (value: string | null) => void;
  error?: string;
  required?: boolean;
}

export default function CountryCombobox({ value, onChange, error, required = false }: CountryComboboxProps) {
  const [query, setQuery] = useState('');

  // Find the selected country object
  const selectedCountry = COUNTRIES.find(country => country.name === value);

  // Filter countries based on search query
  const filteredCountries =
    query === ''
      ? COUNTRIES
      : COUNTRIES.filter((country) =>
          country.name.toLowerCase().includes(query.toLowerCase())
        );

  return (
    <div className="relative">
      <Combobox value={value} onChange={onChange}>
        <div className="relative">
          <Combobox.Input
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10 ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
            displayValue={() => selectedCountry ? `${selectedCountry.flag} ${selectedCountry.name}` : ''}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Type to search countries..."
            required={required}
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-3">
            <ChevronsUpDown
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </Combobox.Button>
        </div>

        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setQuery('')}
        >
          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            {filteredCountries.length === 0 && query !== '' ? (
              <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                No countries found.
              </div>
            ) : (
              filteredCountries.map((country) => (
                <Combobox.Option
                  key={country.code}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                      active ? 'bg-blue-50 text-blue-900' : 'text-gray-900'
                    }`
                  }
                  value={country.name}
                >
                  {({ selected, active }) => (
                    <>
                      <span className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}>
                        <span className="mr-2">{country.flag}</span>
                        {country.name}
                        {country.priority === 'high' && (
                          <span className="ml-2 text-xs text-gray-500">(Popular)</span>
                        )}
                      </span>
                      {selected ? (
                        <span
                          className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                            active ? 'text-blue-600' : 'text-blue-600'
                          }`}
                        >
                          <Check className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </Transition>
      </Combobox>

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
