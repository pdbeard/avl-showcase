#!/bin/bash
~/builds/crate-1.1.1/bin/crash -c "COPY showcase.projects from '$(pwd)/sql/MOCK_DATA.json'"
~/builds/crate-1.1.1/bin/crash -c "COPY showcase.campuses from '$(pwd)/sql/campuses.json'"
~/builds/crate-1.1.1/bin/crash -c "COPY showcase.disciplines from '$(pwd)/sql/disciplines.json'"
~/builds/crate-1.1.1/bin/crash -c "COPY showcase.categories from '$(pwd)/sql/categories.json'"


