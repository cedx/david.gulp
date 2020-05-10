#!/usr/bin/env pwsh
Set-StrictMode -Version Latest
Set-Location (Split-Path $PSScriptRoot)
node_modules/.bin/tsc.ps1 --project src/tsconfig.json
