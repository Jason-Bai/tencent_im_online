# 修改imonline type 为 status

```
ALTER TABLE `imonline` CHANGE `type` `status` enum('predicted','predicting') NOT NULL DEFAULT 'predicted';
```