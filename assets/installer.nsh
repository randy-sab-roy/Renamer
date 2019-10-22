!macro customInstall
  ReadRegStr $R0 HKCU "Software\Classes\directory\Background\shell\Renamer\command" ""
  ${If} $R0 == ""
    WriteRegStr HKCU "Software\Classes\directory\Background\shell\Renamer" "" "Bulk Rename"
    WriteRegStr HKCU "Software\Classes\directory\Background\shell\Renamer\command" "" '"$INSTDIR\Renamer.exe" \"%V\"'
  ${EndIf}
!macroend

!macro customUnInstall
    DeleteRegKey HKCU 'Software\Classes\directory\Background\shell\Renamer'
!macroend