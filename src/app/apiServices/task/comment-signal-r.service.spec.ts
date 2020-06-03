import { TestBed } from '@angular/core/testing';

import { CommentSignalRService } from './comment-signal-r.service';

describe('CommentSignalRService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CommentSignalRService = TestBed.get(CommentSignalRService);
    expect(service).toBeTruthy();
  });
});
