#!/bin/bash
/usr/share/crate/bin/crash < ./sql/schemas.sql
/usr/share/crate/bin/crash -c "COPY showcase.projects from '$(pwd)/sql/MOCK_DATA.json'"
/usr/share/crate/bin/crash -c "COPY showcase.campuses from '$(pwd)/sql/campuses.json'"
/usr/share/crate/bin/crash -c "COPY showcase.disciplines from '$(pwd)/sql/disciplines.json'"
/usr/share/crate/bin/crash -c "COPY showcase.categories from '$(pwd)/sql/categories.json'"
