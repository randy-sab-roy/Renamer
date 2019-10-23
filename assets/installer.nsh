!macro customInstall
  WriteRegStr HKCU "Software\Classes\directory\Background\shell\Renamer" "" "Bulk Rename"
  WriteRegStr HKCU "Software\Classes\directory\Background\shell\Renamer\command" "" '"$INSTDIR\Renamer.exe" --dir "\"%V\""'
!macroend

!macro customUnInstall
    DeleteRegKey HKCU 'Software\Classes\directory\Background\shell\Renamer'
!macroend