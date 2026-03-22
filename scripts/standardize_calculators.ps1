$files = Get-ChildItem -Path "frontend\public\calculators" -Recurse -Filter "*.html"

foreach ($file in $files) {
    Write-Host "Processing $($file.FullName)..."
    $content = Get-Content $file.FullName -Raw
    
    # 1. Standardize Sidebar History Script
    # Remove old renderSidebarHistory function
    $content = $content -replace 'function\s+renderSidebarHistory\s*\([^)]*\)\s*\{[\s\S]*?\}\s*function\s+clearSidebarHistory', 'function clearSidebarHistory'
    $content = $content -replace 'function\s+clearSidebarHistory\s*\([^)]*\)\s*\{[\s\S]*?\}', ''
    
    # Extract Tool Name if possible (usually from save...Log or save...Project function)
    $toolNameMatch = [regex]::Match($content, "window\.saveCalcToHistory\(\s*'([^']+)'")
    if ($toolNameMatch.Success) {
        $toolName = $toolNameMatch.Groups[1].Value
        $content = $content -replace "renderSidebarHistory\(\);", "initSidebarHistory('$toolName', 'sidebar-history-container');"
    }

    # 2. Fix save...Log buttons to call initSidebarHistory after save
    # (The v3.0 calc-utils.js already does this if window.renderSidebarHistory exists)
    
    # 3. Ensure calc-utils.js is loaded
    if ($content -notlike "*calc-utils.js*") {
        $content = $content -replace '</script>', "</script>`n<script src='/js/calc-utils.js'></script>"
    }

    Set-Content $file.FullName $content
}
