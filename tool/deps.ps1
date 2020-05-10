#!/usr/bin/env pwsh
Set-StrictMode -Version Latest
Set-Location (Split-Path $PSScriptRoot)

tool/build.ps1
node_modules/.bin/gulp.ps1 --gulpfile=tool/gulpfile.cjs
