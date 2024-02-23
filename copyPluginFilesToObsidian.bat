@echo off

echo Copying files...

xcopy "D:\Everything\Logic\Hamza\ANT\AntObsidPlugin\obsidian-sample-plugin\main.js" "D:\Everything\Obsidian\WorldBuilder Sync\.obsidian\plugins\ant-plugin\" /D /Y
xcopy "D:\Everything\Logic\Hamza\ANT\AntObsidPlugin\obsidian-sample-plugin\styles.css" "D:\Everything\Obsidian\WorldBuilder Sync\.obsidian\plugins\ant-plugin\" /D /Y
xcopy "D:\Everything\Logic\Hamza\ANT\AntObsidPlugin\obsidian-sample-plugin\manifest.json" "D:\Everything\Obsidian\WorldBuilder Sync\.obsidian\plugins\ant-plugin\" /D /Y

echo Copy operation completed.
